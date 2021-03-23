import {v4 as uuidv4} from "uuid"

const L = window.L
const stamenAttribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

class MapTool {
	constructor(){
		this.map = null
		this.currentPinId = null
		this.ownPins = {}
		this.othersPins = {}
		this.configuration = {}
	}
	
	createMap = (domId="map", mapOptions) => {
		    const defaultMapOptions = {
							centerLat: 46.0569, 
							centerLng:14.5058, 
							zoom:5, 
							bubblingMouseEvents:false
			}
			const options = {...defaultMapOptions, ...mapOptions}
			
			return new L.Map(domId, {
				center: new L.LatLng(options.centerLat, options.centerLng),
				zoom: options.zoom,
				bubblingMouseEvents: options.bubblingMouseEvents
			});
		}
	
	createTileLayer = (layer_style) => {
		const url = `https://stamen-tiles-{s}.a.ssl.fastly.net/${layer_style}/{z}/{x}/{y}.{ext}`
		const layerConfig = {
							 attribution: stamenAttribution,
							 subdomains: 'abcd',
							 minZoom: 1,
							 maxZoom: 16,
							 ext: 'jpg'
		}
		
		return L.tileLayer(url, layerConfig)
	}
	
	fontAwesomeIcon = modifier => L.divIcon({
		html: '<i class="fa fa-map-marker"></i>',
		iconSize: [40, 40],
  		iconAnchor: [20, 40],
	  	className: `marker-icon ${(modifier && ("marker-icon--" + modifier)) || ""}`
	});
	
	createMarker = (coordinates, markerSettings) => {
		const defaultMarkerSettings = {
			alt:"Map marker", 
			draggable:false, 
			bubblingMouseEvents:false
		}
		const settings = {...defaultMarkerSettings, markerSettings}
		
		return L.marker(coordinates, 
						{
						  draggable: settings.draggable,
						  bubblingMouseEvents: settings.bubblingMouseEvents,
						  keyboard: true,
						  alt: settings.alt,
						  icon: this.fontAwesomeIcon()
		});
	}
	
	addMarkerByIdAndCoordinates = (pinId, coordinates) => {
		const altTextForMarker = 
			  `Chatroom pin at coordinates ${coordinates.lat} latitude and ${coordinates.lng} longitude` 
        let marker = this.createMarker(coordinates, { alt: altTextForMarker });
		marker.pinId = pinId
        
		marker.on("click", (evt) => {
			this.configuration.pinClickCallback(evt.target.pinId)
        })
		    		
		this.map.addLayer(marker)
		
		return marker
	}
	
	addMarkerOnMapClick = (evt) => {
        let coordinates = this.map.mouseEventToLatLng(evt.originalEvent)
		let pinId = uuidv4()
		
		const marker = this.addMarkerByIdAndCoordinates(pinId, coordinates)
		this.ownPins[marker.pinId] = marker
			
		this.configuration.onClickOnMapCallback(pinId, coordinates)
	}
	
	removeMarkerById = (pinId) => {
		this.map.removeLayer(this.othersPins[pinId])
		delete this.othersPins[pinId]
	}
	
	highlightPin(pinId){
		if(this.currentPinId){
			let oldMarker = this.ownPins[this.currentPinId] || this.othersPins[this.currentPinId]
			if (oldMarker){
				oldMarker.setIcon(this.fontAwesomeIcon())
			}
		}
		if (pinId){
			this.currentPinId = pinId
			let newMarker = this.ownPins[this.currentPinId] || this.othersPins[this.currentPinId]
			newMarker.setIcon(this.fontAwesomeIcon("highlighted"))
		}
		
	}
	
	initialize = (config) =>{
		
		if (!this.map){
			this.configuration.onClickOnMapCallback = config && config.onClickOnMapCallback
			this.configuration.pinClickCallback = config && config.pinClickCallback
			
			const mapOptions = config && config.mapOptions
			this.map = this.createMap("map", mapOptions)  
			this.createTileLayer("watercolor").addTo(this.map);
			this.map.on("click", this.addMarkerOnMapClick )
		}
	}
	
	render = (pins) => {
		
		const pinsToBeRendered = {...pins}
		const pinsToBeRemovedById = []
		
		//Go through the pins that are already rendered
		Object.keys(this.othersPins).forEach(keyInLocalPins => {
			if (pinsToBeRendered[keyInLocalPins]){
				//pin is already rendered and it has to remain, remove it from pinsToBeRendered
				delete pinsToBeRendered[keyInLocalPins]
			} else{
				//pin is currently rendered but has to be removed, add it to trash
				pinsToBeRemovedById.push(this.othersPins[keyInLocalPins].pinId)
			}
		})
		
		//Empty trash: remove from map pins that are no longer needed
		pinsToBeRemovedById.forEach(id => this.removeMarkerById(id))
		
		//The pins that remained in pinsToBeRendered do not yet exist on map and they must be added
		Object.keys(pinsToBeRendered).forEach(keyInPinsToBeRendered => {
			let pinId = pinsToBeRendered[keyInPinsToBeRendered].pinId
			let coordinates = pinsToBeRendered[keyInPinsToBeRendered].coordinates
			
			let marker = this.addMarkerByIdAndCoordinates(pinId, coordinates)
			this.othersPins[marker.pinId] = marker
		})
	}
	
}

export default new MapTool()