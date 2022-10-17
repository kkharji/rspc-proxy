# rspc-proxy

Experimental proxy for [rspc](https://github.com/oscartbeaumont/rspc). provides an a index
based access to running query/mutate/subscribe with support for nested keys and keys with
different operations. WARNING: Maybe deprecated and moved to rspc core repo. only 0.1.2 is
supported.

## Usage

```typescript
client.version.query();
client.sendMsg.mutate("Hello using proxy");
client.pings.subscribe([], {
    onData(msg) { console.log(msg) }
})
```

## Install

### Client

#### NPM
```bash
npm install @rspc-proxy/client # required  @rspc/client
```
#### PNPM
```bash
pnpm add @rspc-proxy/client # required  @rspc/client
```

### React

#### NPM
```bash
npm install @rspc-proxy/react # required  @rspc/react
```
#### PNPM
```bash
pnpm add @rspc-proxy/react # required  @rspc/react
```

### Solid

#### NPM
```bash
npm install @rspc-proxy/solid # required  @rspc/solid
```
#### PNPM
```bash
pnpm add @rspc-proxy/solid # required  @rspc/solid
```
