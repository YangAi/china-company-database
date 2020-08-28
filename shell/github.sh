echo "Start github"

git add .

if [ $0 ]
then
  git commit -m "$0"
else
  git commit -m "automate save"
fi

git push
