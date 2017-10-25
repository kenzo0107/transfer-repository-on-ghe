CONTAINER_NAME=cj
CASPERJS=docker-compose run --rm ${CONTAINER_NAME}
WORKDIR=./
SCRIPT=ghe-org-transfer.js

default:
	$(MAKE) version

reupd:
	docker-compose stop ${CONTAINER_NAME}
	docker-compose rm -f ${CONTAINER_NAME}
	docker-compose build ${CONTAINER_NAME}
	docker-compose up -d ${CONTAINER_NAME}

upd:
	docker-compose up -d ${CONTAINER_NAME}

version:
	$(CASPERJS)

run:
	$(CASPERJS) ${SCRIPT} "${URL}"

test:
	$(CASPERJS) test ${SCRIPT}
