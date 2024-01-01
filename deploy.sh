#!/bin/bash
yarn build
CURRENT=$(cd $(dirname $0);pwd)
rsync -arv --delete -e "ssh -i ~/.ssh/aws-wsl.pem" ${CURRENT}/build aws:~/muscle_history_front/