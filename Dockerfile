FROM hugomods/hugo:exts

WORKDIR /src
EXPOSE 1313
ENTRYPOINT ["hugo"]
CMD ["server", "--bind", "0.0.0.0", "--port", "1313", "--baseURL", "http://localhost:1313/", "--appendPort=false", "--poll", "700ms"]
