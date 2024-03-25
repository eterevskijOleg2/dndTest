import { useState } from 'react'
import cn from 'classnames'
import { useDrag } from 'react-dnd'
import style from './style.module.css'
import { useDrop } from 'react-dnd'
import { useDragLayer } from 'react-dnd'

export const NewArticle = ({ children, type, title, id, parentPath = [], move }) => {
    const path = [...parentPath, id];

    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open)
    }

    const dragState = useDragLayer(
        monitor => {
            return ({
                dragItem: monitor.getItem(),
                isDragging: monitor.isDragging(),
            })
        }
    )

    if (type === 'article') {
        return <Article title={title} id={id} path={path} />
    }

    if (type === 'folder' && (!dragState.isDragging || dragState.dragItem.id === id)) {
        return <FolderDraggable type={type} title={title} id={id} toggle={toggle} open={open} path={path} move={move} >
            {
                children.map(item => {
                    return (
                        <NewArticle key={item.id} {...item} parentPath={path} move={move} />
                    )
                })
            }
        </FolderDraggable>
    }

    if (type === 'folder') {
        return <Folder type={type} title={title} id={id} toggle={toggle} open={open} path={path} move={move} >
            {
                children.map(item => {
                    return (
                        <NewArticle key={item.id} {...item} parentPath={path} move={move} />
                    )
                })
            }</Folder>
    }
}

const Article = ({ title, id, path }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'card',
        item: { title, id, path },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
    }), [path])

    return (
        <div className={style.article} ref={drag}>
            <div className={style.header}>

                <p className={style.title}>{title}{isDragging && 'Тащат'}</p>
            </div>
        </div>
    )
}

const Folder = ({ title, children, toggle, open, move, path }) => {

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'card',
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop()
            // ХЗ почему так, но это работает
            if (!didDrop) {
                move(item.path, path)
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    }))

    return (
        <div className={style.article} ref={drop}>
            <div className={style.header}>
                <p className={style.title}>📁{isOver && "Можно кидать"}{title}</p>
                <button onClick={toggle} className={cn(style.expandButton, { [style.open]: open })}>Стат</button>
            </div>
            {children && open &&
                children
            }
        </div>
    )
}

const FolderDraggable = ({ title, children, id, toggle, open, path }) => {

    const [, drag] = useDrag(() => ({
        type: 'card',
        item: { title, id, path },
    }))

    return (
        <div className={style.article} ref={drag}>
            <div className={style.header}>
                <p className={style.title}>📁 {title}</p>
                <button onClick={toggle} className={cn(style.expandButton, { [style.open]: open })}>Таск</button>
            </div>
            {children && open &&
                children
            }
        </div>
    )
}