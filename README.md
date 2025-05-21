# Enhanced Forge Resolver

Demonstrates:

- A convention for declaring resolver functions in a type-safe manner
- Creating the handler function referenced in the manifest
- Type-safe invocation of resolver functions from a consumer module
- Creating type-safe proxies for functions or even the entire resolver
- Registration of schemas (eg. Zod) against resolver functions for payload and
  result validation
- Use any [Standard Schema](https://standardschema.dev/) compliant validation
  lib (eg. Zod)
- No dependencies on `@forge/*` or other packages (other than the optional
  schema lib of your choice)

## Structure

- `resolver/` - contains all the potentially re-usable utilities and types
- `example-provide/` - example that provides the type-safe resolver
- `example-consumer/` - example of a consumer that invoke the resolver function
  in a type-safe manner

## Testing

NOTE: this is currently a PoC to demonstrate the type-safety, it has not been
runtime tested yet.
