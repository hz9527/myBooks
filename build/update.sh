read -p "do you confirm update website?" -n 1 -r
each
if [[ $REPLY =~ ^[Yy]$ ]];then
  gitbook build
  git checkout gh-pages
  if [[ $? == 0]];then
    rm -rf ./books ./gitbook
    rm -f ./index.html ./methods.md ./search_index.json
    mv ./_book/grep (index.\html|methods.\md|search_index.\json|books|gitbook) ./
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
