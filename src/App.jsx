import { useState } from 'react';
import { NewArticle } from './components/NewArticle'
import update from 'immutability-helper';

const App = () => {

  const [articles, setArticles] = useState(
    [
      { id: 1, title: 'Папка 1', type: 'folder', children: [{ title: 'Папка 2', type: 'folder', id: 2, children: [{ title: 'Статья 3', type: 'article', id: 3, }] }] },
      { id: 4, title: 'Папка 4', type: 'folder', children: [{ id: 5, title: 'Папка 5', type: 'folder', children: [{ title: 'Статья 6', type: 'article', id: 6, }] }, { id: 7, title: 'Статья 7', type: 'article' }] },
      { id: 8, title: 'Статья 8', type: 'article' }
    ]
  );

  const getIndexPath = (path, articles) => {
    const target = path[0];
    const pathIndex = [];

    const index = articles.findIndex((article) => {
      return article.id === target;
    })

    pathIndex.push(index)

    if (path.length > 1) {
      const childrenIndex = getIndexPath(path.splice(-1), articles[index].children);
      pathIndex.push(...childrenIndex)
    }

    return pathIndex;
  }

  const move = (from, to) => {
    debugger
    console.log(getIndexPath(from, articles));
    console.log(getIndexPath(to, articles));
    
    // setArticles([...articles, { id: 8, title: 'Статья 8', type: 'article' }])

    // setArticles(update(articles,{0:{$push: [{ id: 8, title: 'Статья 8', type: 'article' }] }})); // ['x', 'y']
    // setArticles(update(articles, {$splice: [[1, 1]] } )); // ['x', 'y']


    // const addition = [{ id: 8, title: 'Статья 8', type: 'article' }];
    // setArticles(update(articles, { $splice: [[1, 1]] })); // ['x', 'y']
  }

  return (
    <div>

      {
        articles.map(item => {
          return (
            <NewArticle key={item.id} {...item} move={move} />
          )
        })
      }


    </div>
  )
}

export default App;