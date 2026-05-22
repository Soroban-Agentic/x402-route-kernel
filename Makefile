.PHONY: all build test contracts backend clean

all: build

build: contracts backend

contracts:
	cd contracts && cargo build --target wasm32-unknown-unknown --release

test-contracts:
	cd contracts && cargo test

backend:
	cd backend && npm run build

backend-dev:
	cd backend && npm run dev

install:
	cd backend && npm install
	cd sdk && npm install

clean:
	cd contracts && cargo clean
	rm -rf backend/dist
	rm -rf sdk/dist
