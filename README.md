# Elgato Stream Deck Plugin Information

## Docs

- [Official Docs](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started/)

## Notes

- Setting images
  - SVGs can be good if you need to customize before rendering


# VPN Status Plugin

## Ideas

- Checkbox - "show state flag when connected to US server?"



## Other

- https://api.nordvpn.com/v1/servers?limit=[number]
- https://web-api.nordvpn.com/v1/ips/info
- https://www.ip2location.io/sign-up
- https://rest.db.ripe.net/geolocation?ipkey={ip}
- https://rest.db.ripe.net/search?query-string={ip}
    - https://docs.db.ripe.net/RIPE-Database-Structure/REST-API-Data-model/#whoisresources

## Example Response

```json
{
  "ip": "185.61.158.17",
  "country": "United Kingdom",
  "country_code": "GB",
  "region": "England",
  "zip_code": "EC4R",
  "city": "London",
  "state_code": "ENG",
  "longitude": -0.093,
  "latitude": 51.5088,
  "isp": "Hydra Communications",
  "isp_asn": "Hydra Communications Ltd",
  "gdpr": true,
  "protected": true
}
```
