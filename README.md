# Kókány Neptun

## Indítás

Az alkalmazás indításához egyszerűen használható az alábbi Docker Compose parancs:

```sh
docker compose up
```

Ez a konténerek indítása után monitorozni fogja azok kimeneteit, ebből a módból a `d` billentyűvel léphetsz ki (*detach*).

> Ha tesztelés közbeni változtatásokat szeretnél eszközölni, használd a `docker compose up --build` parancsot.

Ha a mongo-nak szeretnél kezdeti adathalmazt adni, használd az alábbi szkriptet:

```sh
docker compose run app node /app/src/data_access/seed.js
```
