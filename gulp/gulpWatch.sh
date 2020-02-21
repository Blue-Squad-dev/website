while ! [ -f gulpstop ];
do
	gulp watch
	echo "Gulp is finished."
	sleep 5
done