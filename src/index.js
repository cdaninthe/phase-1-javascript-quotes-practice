document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('quote-list')
    const form = document.getElementById('new-quote-form')
    const newQuote = document.getElementById('new-quote')
    const author = document.getElementById('author')
    const label = document.getElementsByTagName('label')[0]
    let id;
    fetchQuotes()
    sortButton()
    const sortBtn = document.getElementById('sort-btn')
    
    //when i click sort button
    sortBtn.addEventListener('click', () => {
        if (sortBtn.innerText === 'Sort by Author: OFF'){
            sortBtn.innerText = 'Sort by Author: ON'
            fetchQuotesByAuthor()
        }
        else if (sortBtn.innerText === 'Sort by Author: ON'){
            sortBtn.innerText = 'Sort by Author: OFF'
            fetchQuotes()
        }
    })

    //add a sort button
    function sortButton(){
        const btn = document.createElement('button')
        btn.innerText = 'Sort by Author: OFF'
        btn.id = 'sort-btn'
        document.getElementsByTagName('div')[0].appendChild(btn)
        document.getElementsByTagName('div')[0].insertBefore(btn, list)
    }



    //display quotes
    function displayQuotes(quoteObj){
        const li = document.createElement('li')
        li.className = 'quote-card'
        li.id = quoteObj.id

        const blockquote = document.createElement('blockquote')
        blockquote.setAttribute('class', 'blockquote')

        const quote = document.createElement('p')
        quote.setAttribute('class', 'mb-0')
        quote.innerText = quoteObj.quote

        const footer = document.createElement('footer')
        footer.setAttribute('class', 'blockquote-footer')
        footer.innerText = quoteObj.author

        const br = document.createElement('br')

        const likeBtn = document.createElement('button')
        likeBtn.setAttribute('class', 'btn-success')
        likeBtn.innerText = 'Likes: '

        const likes = document.createElement('span')
        likes.setAttribute('type', 'number')
        if (quoteObj.likes) {
            likes.innerText = quoteObj.likes.length

        }
        else {likes.innerText = 0}
       
        const deleteBtn = document.createElement('button')
        deleteBtn.setAttribute('class', 'btn-danger')
        deleteBtn.innerText = 'Delete'

        const editBtn = document.createElement('button')
        editBtn.innerText = 'Edit'

        list.appendChild(li)
        li.appendChild(blockquote)
        blockquote.append(quote, footer, br, likeBtn, deleteBtn, editBtn)
        likeBtn.appendChild(likes)

        //click on delete button
        deleteBtn.addEventListener('click', (event) => {
            deleteQuote(quoteObj.id)
            document.getElementById(`${quoteObj.id}`).remove()
        })

        //click on like button
        likeBtn.addEventListener('click', () => {
            likes.innerText = Number(likes.innerText) + 1
            likeQuote(quoteObj.id, Date.now())
        })

        //click on edit button
        editBtn.addEventListener('click', () => {
            window.scrollTo(0,document.body.scrollHeight);
            label.innerText = 'Edit Quote'
            label.style.backgroundColor = 'cyan'
            newQuote.value = quoteObj.quote
            author.value = quoteObj.author
            id = quoteObj.id
        })

    }

    //modify quote on DOM
    function modifyQuote(id){
        const li = document.getElementById(`${id}`).children[0]
        li.children[0].innerText = newQuote.value
        li.children[1].innerText = author.value
    }

    //add quote to list
    function addQuote(){
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application.json'
            },
            body: JSON.stringify({
                quote: newQuote.value,
                author: author.value
            })
        })
        .then(resp => resp.json())
        .then(data => {
            displayQuotes(data)
            newQuote.value =''
            author.value = ''
        })
    }

    //Edit a quote
    function editQuote(id) {
        fetch(`http://localhost:3000/quotes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                quote: newQuote.value,
                author: author.value 
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            newQuote.value = ''
            author.value = ''
            label.innerText = 'New Quote'
            label.style.backgroundColor = 'white'
        })
    }

    //when I click submit button to either add or edit a quote
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        if (label.innerText === 'New Quote'){
            addQuote()
        }
        else if (label.innerText === 'Edit Quote'){
            modifyQuote(id)
            editQuote(id)
        }
    })


    //fetch quotes
    function fetchQuotes(){
        fetch('http://localhost:3000/quotes?_embed=likes')
        .then(resp => resp.json())
        .then(data => {
            list.innerText = ''
            data.forEach(quoteObj => {
                displayQuotes(quoteObj)
            });
        })
    }

    //delete quote in database
    function deleteQuote(id){
        fetch(`http://localhost:3000/quotes/${id}`, {
            method: 'DELETE',
            headers:{
                "Content-Type": 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(data => console.log(data))
    }

    //fetch quotes by author
    function fetchQuotesByAuthor(){
        fetch('http://localhost:3000/quotes?_sort=author')
        .then(resp => resp.json())
        .then(data => {
            list.innerText = ''
            data.forEach(quoteObj => {
                displayQuotes(quoteObj)
            });
        })
    }

    //update database when a quote is liked
    function likeQuote(id, date){
        fetch(`http://localhost:3000/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }, 
            body: JSON.stringify({
                    quoteID: id, 
                    createdAt: date
                })
        })
        .then(resp => resp.json())
        .then(data => console.log(data))
    }

})