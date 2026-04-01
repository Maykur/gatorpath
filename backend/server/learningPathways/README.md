
# Learning taxonomy seed generators

These scripts generate the JSON seed files used by the learning taxonomy layer.

## Expected folder structure

Place these scripts inside:

`backend/learningPathways/`

and keep your program export in:

`backend/learningPathSeeds/programs.json`

The scripts will write these files into `backend/learningPathSeeds/`:

- `learning_tracks.seed.json`
- `program_aliases.seed.json`
- `program_track_map.seed.json`
- `taxonomy_summary.json`

## Run everything

From the `backend/learningPathways` folder:

```bash
node generate_all_learning_seeds.js
```

## Run individual generators

```bash
node generate_learning_tracks_seed.js
node generate_program_aliases_seed.js
node generate_program_track_map_seed.js
node generate_taxonomy_summary.js
```

## Notes

- `programs.json` should be an array of objects with:
  - `program_name`
  - `program_type`

- These generators are first-pass heuristics based on names.
- As you improve mappings, you can update `taxonomy_config.js` instead of hand-editing the generated JSON files.
- If UF adds new minors/certificates, replace `programs.json` and rerun the generators.
