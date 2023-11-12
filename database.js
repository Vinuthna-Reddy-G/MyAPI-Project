const books =[
 {
    ISBN : "1234",
    title : "tesla",
    pubData : "2023-10-08",
    language : "english",
    numPage : 250,
    author: [1,2],
    publication : [1],
    category :['tech','space','education'],
}
]

const author = [ {
    ID : "1",
    name : "sony",
    books : ["1234", "silentone"]
},
{
    ID : "2",
    name : "vinuthna",
    books : ["1234","nothing"]
}
]

const publication = [
    {
        id : "1",
        name : "codtext",
        books : ["1234"]
    },
    {
        id : "2",
        name : "codtext2",
        books : []
    }
]
//external dataset - so we have to export 
module.exports  = {books, author, publication};