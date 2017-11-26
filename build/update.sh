read -p "do you confirm update website?" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]];then
  gitbook build
  git checkout gh-pages
  if [[ $? == 0 ]];then
    git pull origin gh-pages
    rm -rf ./books ./gitbook
    rm -f ./index.html ./search_index.json
    mv ./_book/books ./_book/gitbook ./_book/index.html  ./_book/search_index.json ./
    git status
    git add .
    git commit -m ":memo: update notes"
    git push origin gh-pages
    if [[ $? == 0 ]];then
      git checkout master
      gitbook serve .
    else
      echo "some error in gh-pages"
    fi
  fi
fi
