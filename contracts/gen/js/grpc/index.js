/**
 * NOTE: I prefer not to nest this generation inside my `www`, `gateway`, or any other modules and/or packages
 * Instead, I'm directly exporting the correct instance of the library.
 * For now I aim to keep things readable and "flat", probably in the future i'll refactor this.
 *
 * @see https://github.com/grpc/grpc-node/issues/2228
 */
export * from "@grpc/grpc-js";
