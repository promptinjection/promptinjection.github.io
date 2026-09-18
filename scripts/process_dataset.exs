Mix.install([
  {:csv, "~> 3.2"},
  {:jason, "~> 1.4"}
])

defmodule DatasetProcessor do
  @input_files [
    "prompt-injection-v3-part-1.csv",
    "prompt-injection-v3-part-2.csv",
    "prompt-injection-v3-part-3.csv"
  ]

  @output_dir "data"
  @categories_dir "data/categories"
  @max_benign_web 10_000
  @featured_per_cat 5

  def run do
    IO.puts("==> Starting Prompt Injection v3 Dataset Processor (Elixir)")
    start_time = System.monotonic_time(:millisecond)

    File.mkdir_p!(@categories_dir)

    # Initialize ETS tables for fast, low-memory categorization
    table = :ets.new(:prompts, [:duplicate_bag, :public])
    stats_table = :ets.new(:stats, [:set, :public])

    IO.puts("==> Streaming and decoding 3 CSV files...")

    file_stream =
      @input_files
      |> Enum.map(fn path -> File.stream!(path, :line, []) end)
      |> Stream.concat()
      |> CSV.decode(headers: true, escape_max_lines: 10_000)

    {total_count, valid_count} =
      file_stream
      |> Stream.transform({0, 0}, fn
        {:ok, %{"categories" => raw_cat, "prompt_text" => raw_prompt}}, {total, valid} ->
          cat = String.trim(raw_cat || "")
          prompt = String.trim(raw_prompt || "")

          if cat != "" and prompt != "" do
            # Update category count
            :ets.update_counter(stats_table, cat, 1, {cat, 0})

            # Store in ETS table: for Benign limit to @max_benign_web for web files
            # For all attack categories, store ALL prompts
            current_cat_count = :ets.lookup_element(stats_table, cat, 2)

            if cat != "Benign" or current_cat_count <= @max_benign_web do
              :ets.insert(table, {cat, prompt})
            end

            new_total = total + 1
            new_valid = valid + 1

            if rem(new_total, 100_000) == 0 do
              IO.puts("    Processed #{new_total} rows...")
            end

            {[], {new_total, new_valid}}
          else
            {[], {total + 1, valid}}
          end

        {:error, _reason}, {total, valid} ->
          {[], {total + 1, valid}}
      end)
      |> Enum.reduce({0, 0}, fn _, acc -> acc end)

    IO.puts("==> Total rows processed: #{total_count}, Valid rows: #{valid_count}")

    # Extract stats
    stats_list = :ets.tab2list(stats_table)
    category_counts = Enum.into(stats_list, %{})

    IO.puts("==> Category breakdown:")
    Enum.sort_by(category_counts, fn {_k, v} -> -v end)
    |> Enum.each(fn {cat, count} ->
      IO.puts("    - #{String.pad_trailing(cat, 22)}: #{count}")
    end)

    # Export individual category JSON files
    IO.puts("==> Writing category JSON files...")
    categories = Map.keys(category_counts)

    featured_prompts =
      Enum.reduce(categories, [], fn cat, acc ->
        slug = slugify(cat)
        prompts =
          :ets.lookup(table, cat)
          |> Enum.map(fn {_cat, p} -> p end)

        filename = Path.join(@categories_dir, "#{slug}.json")

        payload = %{
          "category" => cat,
          "slug" => slug,
          "total_in_dataset" => Map.get(category_counts, cat, 0),
          "web_count" => length(prompts),
          "prompts" => prompts
        }

        File.write!(filename, Jason.encode!(payload))

        # Pick top prompts for featured set
        top_samples =
          prompts
          |> Enum.take(@featured_per_cat)
          |> Enum.map(fn p -> %{"category" => cat, "prompt_text" => p} end)

        acc ++ top_samples
      end)

    # Write featured.json
    IO.puts("==> Writing featured.json (#{length(featured_prompts)} prompts)...")
    featured_payload = %{
      "version" => "v3",
      "total_featured" => length(featured_prompts),
      "prompts" => featured_prompts
    }
    File.write!(Path.join(@output_dir, "featured.json"), Jason.encode!(featured_payload))

    # Write manifest.json
    total_dataset_prompts = Enum.sum(Map.values(category_counts))
    IO.puts("==> Writing manifest.json (Total: #{total_dataset_prompts})...")
    manifest_payload = %{
      "version" => "v3",
      "updated_at" => DateTime.utc_now() |> DateTime.to_iso8601(),
      "total_prompts" => total_dataset_prompts,
      "categories_count" => map_size(category_counts),
      "categories" =>
        Enum.map(category_counts, fn {cat, count} ->
          slug = slugify(cat)
          %{
            "name" => cat,
            "slug" => slug,
            "total" => count,
            "file" => "data/categories/#{slug}.json"
          }
        end)
        |> Enum.sort_by(&(-&1["total"]))
    }
    File.write!(Path.join(@output_dir, "manifest.json"), Jason.encode!(manifest_payload, pretty: true))

    elapsed = (System.monotonic_time(:millisecond) - start_time) / 1000
    IO.puts("==> Done in #{Float.round(elapsed, 2)}s! All data files successfully generated.")
  end

  defp slugify(string) do
    string
    |> String.downcase()
    |> String.replace(~r/[^a-z0-9_-]/, "")
  end
end

DatasetProcessor.run()
