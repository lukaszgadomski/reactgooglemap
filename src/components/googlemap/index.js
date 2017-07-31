import React from "react";
import config from "../../config";
import AsyncComponent from "../async";
import "./style.css";
import ReactDOM from "react-dom";

const FactorySpyMaker = googleMapApi => {
  class CustomMarker extends googleMapApi.OverlayView {
    constructor(latlng, map, icon, onMarkerClick) {
      super();
      this.latlng = latlng;
      this.onMarkerClick = onMarkerClick;
      this.icon = icon;
      this.setMap(map);
    }
    calculateAspectRatio(srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
    }
    setNewSize(domEl, width, height) {
      domEl.style.width = width + "px";
      domEl.style.height = height + "px";
    }
    setNewOffset(domEl, projection, width, height) {
      domEl.style.left = projection.x - width / 2 + "px";
      domEl.style.top = projection.y - height - 7 + "px";
    }
    onAdd() {
      let root = (this.root = document.createElement("div"));
      let arrow = this.arrow;

      root.className = "marker";
      arrow = this.arrow = document.createElement("div");
      arrow.className = "arrow";
      let img = document.createElement("img");
      img.src = this.icon;
      var maxWidth = 120; // Max width for the image
      var maxHeight = 40; // Max height for the image
      root.appendChild(arrow);
      root.appendChild(img);

      this.newSize = {
        width: 50,
        height: 50
      };

      img.onload = () => {
        this.newSize = this.calculateAspectRatio(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );
        this.setNewSize(img, this.newSize.width - 4, this.newSize.height - 4);
        this.setNewSize(root, this.newSize.width, this.newSize.height);
        this.setNewOffset(
          root,
          this.point,
          this.newSize.width,
          this.newSize.height
        );
        img.style.position = "relative";
        img.style.visibility = "visible";
      };
      var panes = this.getPanes();
      panes.overlayImage.appendChild(root);

      googleMapApi.event.addDomListener(root, "click", e => {
        e.preventDefault();
        e.stopPropagation();
        this.onMarkerClick(this.newSize);
      });
    }
    draw() {
      let root = this.root;
      this.setNewSize(root, this.newSize.width, this.newSize.height);
      this.point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      this.setNewOffset(
        root,
        this.point,
        this.newSize.width,
        this.newSize.height
      );
    }
    remove() {
      if (this.root) {
        this.root.parentNode.removeChild(this.div);
        this.root = null;
      }
    }
    getPosition() {
      return this.latlng;
    }
    getAnchorPoint() {
      return new googleMapApi.Point(0, -this.newSize.height);
    }
  }
  return {
    create: (latlng, map, icon, onMarkerClick) => {
      return new CustomMarker(latlng, map, icon, onMarkerClick);
    }
  };
};

class InfoWindowContent extends React.Component {
  render() {
    const { name, icon, address, hours } = this.props.infowindow;
    return (
      <div className="info-window">
        <div className="info-window-logo">
          <img src={icon} alt={name} />
        </div>
        <div className="info-window-name">{name}</div>
        <div className="info-window-address">{address}</div>
        <table className="info-window-address-hours">
          <tbody>
            {hours.map(({ day, hours }) => (
              <tr>
                <td>{day}</td>
                <td>{hours}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    );
  }
}

export class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.googleMapApi = window.google.maps;
  }
  addMarkers(markers) {
    const self = this;
    this.markersOnMap = {};
    markers.forEach((marker, i) => {
      // const marker = markers[0];

      const { lat, lng } = marker;
      this.markersOnMap[marker.id] = self.markerFactory.create(
        new this.googleMapApi.LatLng(lat, lng),
        self.map,
        marker.icon,
        offset => {
          self.props.onMarkerClick(marker);
        }
      );
    });
  }
  handleInfoWindow() {
    const { infowindow } = this.props.map;
    if (infowindow) {
      const div = document.createElement("div");

      ReactDOM.render(<InfoWindowContent infowindow={infowindow} />, div);

      this.infowindow =
        this.infowindow ||
        new this.googleMapApi.InfoWindow({
          map: this.map,
          marker: this.markersOnMap[infowindow.id]
        });
      this.infowindow.setContent(div);
      this.infowindow.open(this.map, this.markersOnMap[infowindow.id]);
    }
  }
  componentDidMount() {
    const { map } = this.props;
    const mapConfig = {
      center: new this.googleMapApi.LatLng(map.center.lat, map.center.lng),
      zoom: map.zoom
    };
    this.map = new this.googleMapApi.Map(this.mapRef, mapConfig);
    this.markerFactory = FactorySpyMaker(this.googleMapApi, this.map);
    //if markers are loaded before component mount
    if (map.markers.length) {
      this.addMarkers(map.markers);
    }
  }

  //if markers are loaded after component mount
  componentDidUpdate(prevProps) {
    if (
      this.markerFactory && this.props.map.markers !== prevProps.map.markers
    ) {
      this.addMarkers(this.props.map.markers);
    }
    if (this.props.map.infowindow !== prevProps.map.infowindow) {
      this.handleInfoWindow();
    }
    if (this.props.map.center !== prevProps.map.center) {
      this.map.setCenter(
        new this.googleMapApi.LatLng(
          this.props.map.center.lat,
          this.props.map.center.lng
        )
      );
    }
  }
  render() {
    return (
      <div className="map-container">
        <div
          style={{ position: "absolute", height: "100%", width: "100%" }}
          ref={refDom => {
            this.mapRef = refDom;
          }}
        />
      </div>
    );
  }
}

const asyncMap = () => {
  return new Promise((resolve, reject) => {
    window.onMapLoadSuccessCallback = () => {
      resolve(GoogleMap);
    };
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = `${config.GOOGLE_API_SCRIPT_URL}&callback=onMapLoadSuccessCallback`;
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
  });
};

export default props => {
  return <AsyncComponent loader={asyncMap} {...props} />;
};
