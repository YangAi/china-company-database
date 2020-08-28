echo "Start github"

git add .

if [ $0 ==  '']
then

  echo "123$0"
else
  git commit -m "automate save"
  git push

fi

