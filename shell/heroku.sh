echo "Start Heroku"

git add .

if [ -z "$1" ]
then
    git commit -m "Heroku upload"

else
  git commit -m "$1"

fi

git push heroku master

