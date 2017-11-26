read -p "do you confirm update website?" -n 1 -r
each
if [[ $REPLY =~ ^[Yy]$ ]];then
  gitbook build
  git checkout gh-pages
  if [[ $? == 0]];then
    mv ./_book/books ./_book/gitbook ./_book/index.html ./_book/methods.md ./search_index.json ./
    git status
    git add .
    git commit -m ":memo: update notes"
    git push origin gh-pages
    # if [[ $? == 0 ]];then
    #   git checkout master
    # else
    #   echo "some error in gh-pages"
    # fi
  fi
fi
