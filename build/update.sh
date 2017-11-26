read -p "do you confirm update website?" -n 1 -r
each
if [[ $REPLY =~ ^[Yy]$ ]];then
  gitbook build
  git checkout gh-pages
  if [[ $? == 0]];then
    rm -rf ./
    mv ./_book/* ./
    git status
    git add .
    git commit -m ":memo: update notes"
    git push origin gh-pages
    if [[ $? == 0 ]];then
      git checkout master
    else
      echo "some error in gh-pages"
    fi
  fi
fi
