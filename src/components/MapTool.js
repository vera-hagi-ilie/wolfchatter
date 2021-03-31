import { v4 as uuidv4 } from "uuid"
import _ from "lodash"
import { stamenAttribution } from "../texts/mapTexts"

const L = window.L


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
			this.createTileLayer("watercolor").addTo(this.map)
			this.map.on("click", this.addMarkerOnMapClick )
			this.initialized = true
		}
	}
	
	render = (pins) => {
		const pinsToBeRendered = {...pins}
		const pinsToBeRemovedById = _.difference(Object.keys(this.othersPins), Object.keys(pinsToBeRendered))
		const pinsToBeAddedById = _.difference(Object.keys(pinsToBeRendered), Object.keys(this.othersPins))
		
		pinsToBeRemovedById.forEach(id => this.removeMarkerById(id))
				
		pinsToBeAddedById.forEach(id => {
			let pinId = pinsToBeRendered[id].pinId
			let coordinates = pinsToBeRendered[id].coordinates
			
			let marker = this.addMarkerByIdAndCoordinates(pinId, coordinates)
			this.othersPins[marker.pinId] = marker
		})
	}
	
}

export default new MapTool()