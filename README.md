# Frontend for darksky
```
    $ git clone https://github.com/mwveliz/frontdarksky.git
    $ cd PROJECT
    $ yarn install
```
## Simple build for production
```
    $ yarn run build
```    
## Serve site with yarn
```    
    $ cd build
    $ serve -p 3600 -s .
```    
## Deploy with docker    
```
    $ $ docker build -t frontdarksky .
    $ docker run -d -v deploy -p 0.0.0.0:3006:3006 --name frontdarksky frontdarksky 
```


## Acknowledgments

mwveliz@gmail.com

## See Also

Backend repo: https://github.com/mwveliz/backdarksky
docker-compose for deployment: https://github.com/mwveliz/traefikdarksky

## License

GPL V-3.0
