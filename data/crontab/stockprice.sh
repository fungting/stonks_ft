cd /home/ubuntu/stonks-deployment/spark-docker/
docker-compose up -d
sleep 20
docker exec spark-docker_spark_1 pgrep python | xargs kill
docker exec spark-docker_spark_1 python /opt/bitnami/spark/src/manage.py daily_stock_prices
docker exec spark-docker_spark_1 pgrep python | xargs kill
docker-compose down
