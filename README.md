# Examicutor

* Updates
  * Server is updated through git, compiled on production server.
  * Client is updated through ftp/scp/direct copy. Production files are generated on development machine and copied over.

* Configuration
  * Server has a separate configuration for production and development environments. When updated, configuration file persists.
  * Client has one configuration file sitting on development environments. Configuration is applied when building `dist` files.

### Configuration (template)

```javascript
{
  db: {
    host: '...',
    user: '...',
    password: '...',
    database: '...',
  },
  port: 1234,
  sessionSecret: '...',
  clientPath: '...',
}
```
