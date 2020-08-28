echo "Start github"

git add .

if [ -z "$1"]
then
  git commit -m "$1"
else

  git commit -m "automate save"

fi

git push

