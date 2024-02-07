#!/bin/bash
yarn build
CURRENT=$(cd $(dirname $0);pwd)
rsync -arv --delete -e "ssh -i ~/.ssh/id_rsa" ${CURRENT}/build svps:~/Git/muscle_history_front/