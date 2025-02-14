function createElement (type, props, ...children) {
    const $el = document.createElement(type)
    Object.keys(props).forEach((prop) => 
        prop === 'style' ? 
        Object.keys(props[prop]).forEach((style) => $el[prop][style] = props[prop][style]) : 
        $el[prop] = props[prop]);
    $el.append(...children)
    return $el
}


function Tile (species, name, fact) {
    return createElement(
        'div',
        { className: 'grid-item' },
        createElement('h3', { className: 'text-center mt-2' }, name),
        createElement('img', { src: `images/${species.toLowerCase()}.png`, alt: name}),
        createElement('p', {}, fact)
    )
}

function Dino ({ species, weight, height, diet, where, when, fact }, human) {
    const compareWeight = () => `The ${species} weighs ${weight - human.getWeight()} more lbs than you.`
    const compareHeight = () => `The ${species} is ${height - human.getHeight()} inches more than you.`
    const compareDiet = () => {
        if (diet.toLowerCase() === human.getDiet().toLowerCase()) {
            return `The ${species} and you are both ${diet}s.`
        } else {
            return `The ${species} was a ${diet} and you are a ${human.getDiet()}`
        }
    }
    
    const randomFact = () => {
        
        if (species === 'Pigeon') {
            return fact
        }
        
        const roll = Math.floor(Math.random() * 6 + 1)
        
        switch (roll) {
            case 1:
                return fact
            case 2:
                return compareWeight()
            case 3:
                return compareHeight()
            case 4:
                return compareDiet()
            case 5:
                return `The ${species} lived during the ${when} period.`
            case 6:
                return `The ${species} once lived in what is now ${where}.`
        }
        
    }
    
    const html = () => Tile(species, species, randomFact())
    
    return {
        html
    }
}

function Human ({ name, feet, inches, weight, diet }) {
    const html = () => Tile('Human', name, '')
    const getWeight = () => parseInt(weight)
    const getHeight = () => parseInt(feet) * 12 + parseInt(inches)
    const getDiet = () => diet
    
    return {
        html,
        getWeight,
        getHeight,
        getDiet
    }
}


// Form Handling
const $compareForm = document.getElementById('compareForm')

$compareForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    
    // validating form
    if ($compareForm.checkValidity()) {
        // creating info graph
        const response = await fetch('dino.json')
        const data = await response.json()
        const $grid = document.getElementById('grid')
        const tiles = []
        
        const elements = Array.from($compareForm.elements)
        const formData = {}
        elements.forEach(($el) => { formData[$el.id] = $el.value })
        // const human = Human({ name: 'Ted', feet: '5', inches: '11', weight: '170', diet: 'Herbavor'})
        const human = Human(formData)
        
        $compareForm.style.display = 'none'
        
        const dinos = data.Dinos.forEach((dino, index) => {
            if (index === 4) {
                $grid.append(human.html())
            }
        
            $grid.append(Dino(dino, human).html())
        })    
    } else {
        $compareForm.classList.add('was-validated')   
    }
})