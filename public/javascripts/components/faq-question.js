const faqQuestionTemplate = document.createElement('template');
faqQuestionTemplate.innerHTML = `
    <style>
        :host {
            display: flex;
            flex-direction: column;
            color: var(--text-color);
            background-color: var(--background);
            font-family: 'gabarito', sans-serif;
            width:100%;
            border-radius: 8px;
        }

        .question {
            font-size: var(--h2-font);
            padding: 16px 16px;
            list-style: none;
        }

        details {
            align-items: center; /* Centers children vertically */
            justify-content: start; /* Aligns children to the start (left for LTR languages) */
        }

        .question:hover {
            cursor: pointer;
            background-color: var(--background-hover);
        }

        details {
            width: 100%;
            background-color: transparent;
            display: flex;
        }

        details[open] .question ~ * {
            animation: open 0.7s ease-in-out;
        }

        @keyframes open {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
            
        details summary::-webkit-details-marker {
            display: none;
        }

        .question::before {
            content: "+";
            margin-right: 8px;
        }

        details[open] summary::before {
            content: "-";
            margin-right: 16.5px;
        }

         .answer {
            font-size: var(--h4-font);
            padding: 0px 48px;
            color: var(--light-text);
        }

        .first{
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .last{
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }

    </style>
    <div class="faq-question">
        <details>
            <summary class="question"></summary>
            <p class="answer"></p>
        </details>
    </div>
`;

class FaqQuestion extends HTMLElement {
    
    constructor() {
        super();
        this.question = this.getAttribute('question');
        this.answer = this.getAttribute('answer');
        const shadow = this.attachShadow({mode: 'open'});
        var template = faqQuestionTemplate.content.cloneNode(true);
        template.querySelector('.question').textContent = this.question;
        template.querySelector('.answer').textContent = this.answer;
        shadow.append(template);
    }

}

window.customElements.define('faq-question', FaqQuestion);

async function getFAQ() {
    const response = await fetch('/api/getFAQ');
    const data = await response.json();
    await addFAQ(data);
    checkSiblings();
}

function addFAQ(data){
    for(var i = 0; i < data.length; i++){
        document.querySelector('.content-wrapper').innerHTML+=  
        `<faq-question question="${data[i].question}" answer="${data[i].answer}"></faq-question>`
        ;
    }
}

function checkSiblings(){
    var select = document.querySelector('.content-wrapper').firstChild.shadowRoot.querySelector('.question').classList.add('first');
    var select = document.querySelector('.content-wrapper').lastChild.shadowRoot.querySelector('.question').classList.add('last');
}

window.onload = () => {
    getFAQ();
}