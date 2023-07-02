<script lang="ts">
	import * as d3 from 'd3'
    import { onMount } from 'svelte'
    import { players, winner } from '../stores/roulette'

	export let button: HTMLButtonElement
	export let size: number

	let canvas: HTMLDivElement
	

	onMount( () => {
		players.subscribe( names => {
			console.log( [ names ] )
			const color = d3.scaleSequential()
				.domain( [ 0, names.length ] )
				.interpolator( d3.interpolateRainbow )
			const svg = d3.create( 'svg' )
			
			const css = {
				'font-family': 'Roboto, sans-serif',
				'font-size': '24px',
				height: 600,
				viewBox: [ -size / 2, -size / 2, size, size ].join( ' ' ),
				width: 600
			}
			Object.entries( css ).forEach( ( [ property, value ] ) => svg.attr( property, value ) )

			const group = svg.append( 'g' )
				.attr( 'stoke', 'white' )
			const arc = d3.arc()
				.innerRadius( 0 )
				.outerRadius( size / 2 - 1 )
			
			const addText: Array<( g: typeof group ) => void> = []

			for ( let idx = 0; idx < names.length; idx++ ) {
				const name = names[ idx ]!
				const slice = arc.startAngle( idx * 2 * Math.PI / names.length )
					.endAngle( ( idx + 1 ) * 2 * Math.PI / names.length )
				
				group.append( 'path' )
					.attr( 'fill', color( idx ) as string )
					// @ts-expect-error
					.attr( 'd', slice )
				
				addText.push( group => {
					const textAngle = ( ( 2 * idx + 1 ) / 2 ) * 360 / names.length - 90
					group.append( 'text' )
						.attr( 'text-anchor', 'middle' )
						.text( name )
						.attr( 'x', 150 )
						.attr( 'transform', `rotate(${ textAngle })` )
				} )
			}

			addText.forEach( f => f( group ) )

			canvas.innerHTML = svg.node()!.outerHTML

			button.addEventListener( 'click', ( e: Event ) => {
				button.disabled = true

				const angle = parseInt( canvas.style.rotate.match( /\d+/ )?.[ 0 ] ?? '0', 10 )
				const newAngle = angle + 20 * Math.random() * 360
				canvas.style.rotate = `${ newAngle }deg`

				setTimeout( ( ( button: HTMLButtonElement, angle: number ) => {
					angle = 360 - ( angle - 90 ) % 360
					button.disabled = false

					const sliceAngle = 360 / names.length
					const index = ( Math.floor( angle / sliceAngle ) ) % names.length
					winner.set( names[ index ] )
				} ).bind( undefined, button, newAngle ), 3000 )
			} )
		} )
	} )
</script>

<div bind:this={ canvas }
	id="canvas"
	style:width={ `${ size }px` }
	style:height={ `${ size }px` }
	style:transition="3s ease-in-out"></div>
