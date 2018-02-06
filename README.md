##Demo

####Requirement
- npm (5.6.0)
- docker (17.12.0-ce)

####How to start in dev environment
1. run mongo

```
docker run --name=mongo -p 27017:27017 -d mongo:jessie
```

2. run redis

```
docker run --name redis -p 6379:6379 -d redis:4.0.8
```

3. run api

```
npm install --prefix api
npm start --prefix api
```

4. run cms

```
npm install --prefix web
npm start --prefix web
```

####Access

To access cms form:

http://localhost:8080

To access api documentation:

http://localhost:8000/documentation

####Testing

To test API: (require `ava`)

```
npm test --prefix api
```

Testing for cms is not available.
