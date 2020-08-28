echo "Start github"

git add .

if [ -z "$1" ]
then
  #  git commit -m "automate save"
echo "$1"
else
  git commit -m "$1"
echo "$1"


fi

#git push

