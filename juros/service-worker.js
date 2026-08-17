/* =========================================================
   LEVORATECH — JUROS
   SERVICE WORKER
========================================================= */

const CACHE_NAME = "levoratech-juros-v2";


const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        APP_FILES
                    );

                })

        );


        self.skipWaiting();
    }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(keys => {

                    return Promise.all(

                        keys
                            .filter(
                                key =>
                                    key !== CACHE_NAME
                            )
                            .map(
                                key =>
                                    caches.delete(key)
                            )

                    );

                })

        );


        self.clients.claim();
    }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        /*
         * Só tratamos requisições GET.
         */
        if (
            request.method !== "GET"
        ) {
            return;
        }


        /*
         * Para navegação:
         *
         * 1. tenta buscar a versão atual
         * 2. atualiza o cache
         * 3. se estiver offline, usa o cache
         */
        if (
            request.mode === "navigate"
        ) {

            event.respondWith(

                fetch(request)
                    .then(response => {

                        const resposta =
                            response.clone();


                        caches
                            .open(CACHE_NAME)
                            .then(cache => {

                                cache.put(
                                    request,
                                    resposta
                                );

                            });


                        return response;

                    })
                    .catch(() => {

                        return caches.match(
                            request
                        ).then(cached => {

                            return cached ||
                                caches.match(
                                    "./index.html"
                                );

                        });

                    })

            );

            return;
        }


        /*
         * Para CSS, JS, imagens etc:
         *
         * cache primeiro;
         * rede como fallback.
         */
        event.respondWith(

            caches
                .match(request)
                .then(cachedResponse => {

                    if (cachedResponse) {
                        return cachedResponse;
                    }


                    return fetch(request)
                        .then(response => {

                            /*
                             * Só cacheamos respostas válidas.
                             */
                            if (
                                response &&
                                response.status === 200 &&
                                response.type === "basic"
                            ) {

                                const resposta =
                                    response.clone();


                                caches
                                    .open(CACHE_NAME)
                                    .then(cache => {

                                        cache.put(
                                            request,
                                            resposta
                                        );

                                    });

                            }


                            return response;

                        });

                })

        );

    }
);