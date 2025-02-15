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

function Dino ({ species, weight, height, diet, where, when, fact }) {
    const compareWeight = (human) => {
        const diff = weight - human.getWeight()
        
        if (diff < 0) {
            return `The ${species} weighs ${Math.abs(diff)} fewer lbs than you.`
        } else if (diff > 0) {
            return `The ${species} weighs ${diff} more lbs than you.`
        } else {
            return `The ${species} and you are the same weight.`
        }
    }
    
    
    const compareHeight = (human) => {
        const diff = height - human.getHeight()
        if (diff < 0) {
            return `The ${species} is ${Math.abs(diff)} inches shorter than you.`
        } else if (diff > 0) {
            return `The ${species} is ${diff} inches taller than you.`
        } else {
            return `The ${species} and you are the same height.`
        }
    }
    
    
    const compareDiet = (human) => {
        if (diet.toLowerCase() === human.getDiet().toLowerCase()) {
            return `The ${species} and you are both ${diet}s.`
        } else {
            return `The ${species} was a ${diet} and you are a ${human.getDiet()}`
        }
    }
    
    const getFact = () => fact
    const getSpecies = () => species
    const getWhen = () => when
    const getWhere = () => where
    
    const html = (fact) => Tile(species, species, fact)
    
    return {
        compareWeight,
        compareHeight,
        compareDiet,
        getFact,
        getSpecies,
        getWhen,
        getWhere,
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



const $compareForm = document.getElementById('compareForm')
const $return = document.getElementById('return')
const $grid = document.getElementById('grid')

$compareForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    
    // validating form
    if ($compareForm.checkValidity()) {
        // creating info graph
        const response = await fetch('dino.json')
        const data = await response.json()
        const tiles = []
        
        const elements = Array.from($compareForm.elements)
        const formData = {}
        elements.forEach(($el) => { formData[$el.id] = $el.value })
        // const human = Human({ name: 'Ted', feet: '5', inches: '11', weight: '170', diet: 'Herbavor'})
        const human = Human(formData)
        
        $compareForm.classList.add('d-none')
        $return.classList.remove('d-none')
        
        const dinos = data.Dinos.forEach((obj, index) => {
            if (index === 4) {
                $grid.append(human.html())
            }
            
            const dino = Dino(obj)
            
            if (dino.getSpecies() === 'Pigeon') {
                $grid.append(dino.html(dino.getFact()))
            } else {
                const roll = Math.floor(Math.random() * 6 + 1)
                
                switch (roll) {
                    case 1:
                        $grid.append(dino.html(dino.getFact()))
                        break;
                    case 2:
                        $grid.append(dino.html(dino.compareWeight(human)))
                        break;
                    case 3:
                        $grid.append(dino.html(dino.compareHeight(human)))
                        break;
                    case 4:
                        $grid.append(dino.html(dino.compareDiet(human)))
                        break;
                    case 5:
                        $grid.append(dino.html(`The ${dino.getSpecies()} lived during the ${dino.getWhen()} period.`))
                        break;
                    case 6:
                        $grid.append(dino.html(`The ${dino.getSpecies()} lived during the ${dino.getWhere()} period.`))
                        break;
                }
            }
        })    
    } else {
        $compareForm.classList.add('was-validated')   
    }
})

$return.addEventListener('click', function () {
    $compareForm.classList.remove('d-none')
    $return.classList.add('d-none')
    $grid.innerHTML = ''
}) 