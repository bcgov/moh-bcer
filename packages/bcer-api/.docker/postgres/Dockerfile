FROM postgres:13

COPY ./multiple_databases.sh /docker-entrypoint-initdb.d/
RUN chown postgres:postgres /docker-entrypoint-initdb.d/multiple_databases.sh
RUN chmod u+x ./docker-entrypoint-initdb.d/multiple_databases.sh