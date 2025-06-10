# Enhanced Forge Resolver

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
- Compatibility helpers to aid a gradual migration from `@forge/resolver`
