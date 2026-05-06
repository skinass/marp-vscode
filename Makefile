.PHONY: all install build package clean deps

# Default
default: install

# Paths
CODE_CLI := "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
Vsix     := $(shell node -e "console.log(require('./package.json').name + '-' + require('./package.json').version + '.vsix')")

# ── Full pipeline: deps → build → package → install ──────────────────
install: package
	@echo "📦 Installing $(Vsix) into VS Code..."
	$(CODE_CLI) --install-extension $(Vsix) --force
	@echo "✅ Done. Restart VS Code to activate."

# ── Build webpack bundles ─────────────────────────────────────────────
build:
	npm run build

# ── Package .vsix ────────────────────────────────────────────────────
package: build
	npx vsce package

# ── Clean build artifacts ────────────────────────────────────────────
clean:
	rm -f $(Vsix)
	rm -rf lib/ dist/ preview/preview.js

# ── Install npm dependencies only ────────────────────────────────────
deps:
	npm install
