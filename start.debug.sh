# if [ -d "db-worker/models/whichenglish" ] 
# then
#  	echo "exists"
# else
# 	echo "n/a"
# fi
# cd server
# i=0
# while read line
# do
#     array[ $i ]="$line"        
#     (( i++ ))
# done < <(ls -ls)

# echo ${array[1]}
# create an array with all the filer/dir inside ~/myDir

	# if [ -d "./db-worker/models/$exp" ] 
	# then
	#  	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# else
	# 	mkdir db-worker/models/$exp
	# 	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# fi

	# if [ -d "./db-worker/seeds/$exp" ] 
	# then
	#  	rsync -ua --progress ./experiments/$exp/seeds ./db-worker/seeds/$exp
	# else
	# 	mkdir db-worker/seeds/$exp
	# 	rsync -ua --progress ./experiments/$exp/seeds ./db-worker/seeds/$exp
	# fi

	# if [ -d "./db-worker/models/$exp" ] 
	# then
	#  	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# else
	# 	mkdir db-worker/models/$exp
	# 	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# fi

	# if [ -d "./db-worker/models/$exp" ] 
	# then
	#  	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# else
	# 	mkdir db-worker/models/$exp
	# 	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# fi

	# if [ -d "./db-worker/models/$exp" ] 
	# then
	#  	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# else
	# 	mkdir db-worker/models/$exp
	# 	rsync -ua --progress ./experiments/$exp/models ./db-worker/models/$exp
	# fi

arr=(./experiments/*)

mkdir ./experiments/.temp
mkdir ./experiments/.temp/models
mkdir ./experiments/.temp/migrations
mkdir ./experiments/.temp/seeds
mkdir ./experiments/.temp/controllers
mkdir ./experiments/.temp/workers

for ((i=0; i<${#arr[@]}; i++))
do
    exp = ${arr[$i]} | cut -d'/' -f 3
    mkdir ./experiments/.temp/models/$exp
    mkdir ./experiments/.temp/seeds/$exp
    mkdir ./experiments/.temp/controllers
    mkdir ./ex
