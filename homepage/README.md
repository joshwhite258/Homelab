# Homepage dashboard

Config for the [Homepage](https://gethomepage.dev) dashboard at `home.edscastle.com`.
The Docker LXC reads this folder straight from a git clone, so a push to `main`
shows up on the dashboard within about five minutes.

| File | What it controls |
|---|---|
| `custom.js` | Hero header: title, description, rotating "running" line, GitHub links (edit the `CONFIG` block) |
| `custom.css` | Theme: night-sky background, fonts, glass cards, tab styling |
| `settings.yaml` | Title, Google quick-search, and which groups go on the **Home** / **Server** tabs |
| `widgets.yaml` | Header bar: Google search and clock |
| `bookmarks.yaml` | Links on the Home tab |
| `services.yaml` | Service cards and live widgets on the Server tab |
| `docker-compose.yml` | The Portainer stack |

## Secrets

No API keys live in this repo. `services.yaml` references `{{HOMEPAGE_VAR_*}}`
placeholders, and the real values are set as environment variables on the
Portainer stack.

## Server setup (one time)

```bash
# on the Docker LXC
git clone https://github.com/joshwhite258/Homelab /opt/homelab
( crontab -l 2>/dev/null; echo '*/5 * * * * git -C /opt/homelab pull -q --ff-only' ) | crontab -
```

Then point the Portainer stack's config volume at `/opt/homelab/homepage`
(see `docker-compose.yml`) and add the environment variables.
