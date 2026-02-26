# Hello Capsule

A minimal web capsule sample.

## Structure

```text
hello-capsule/
├── capsule.toml
├── index.html
└── .gitignore
```

## Dry Run

```bash
ato publish --dry-run
```

## CI Publish (Flow 1)

```bash
ato gen-ci
git add .
git commit -m "release: v1.0.0"
git tag v1.0.0
git push origin v1.0.0
```
