<template>
  <div class="home">
    <antenna-modal
      v-if="showModal"
      @closed="showModal = false"
      @created="created"
      :antenna="antenna"
    />
    <div class="hud">
      <div class="menu">
        <ul class="menu-list">
          <li
            v-for="(option, index) in options"
            :key="index"
            class="menu-list-item"
          >
            <a
              href="#"
              @click.prevent="selectOption(option)"
              :selected="option.selected"
              >{{ option.label }}</a
            >
          </li>
        </ul>
      </div>
      <div class="visada-menu" v-if="selectedOption.action == 'selectVisada'">
        <h3 style="margin-bottom: 6px">Linha de Visada</h3>
        <h5 style="margin-top: 0">
          O cálculo será de acordo com as duas últimas antenas selecionadas
        </h5>
        <div
          v-if="visada1"
          style="display: flex; justify-content: space-between"
        >
          <span>{{ visada1.label }}</span>
          <span>{{ visada1.distance.toFixed(2) }} km</span>
        </div>
        <div
          v-if="visada2"
          style="display: flex; justify-content: space-between"
        >
          <span>{{ visada2.label }}</span>
          <span>{{ visada2.distance.toFixed(2) }} km</span>
        </div>
        <div
          v-if="visada1 && visada2"
          style="display: flex; justify-content: space-between"
        >
          <span><strong>Total:</strong></span>
          <span>{{ total }} km</span>
        </div>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import L from "leaflet";
import AntennaModal from "../components/AntennaModal.vue";
import { getAntennas, eraseAll } from "../services/Antenna";

export default {
  name: "Home",
  components: { AntennaModal },
  computed: {
    selectedOption() {
      return this.options.find(({ selected }) => selected);
    },
    total() {
      return (this.visada1.distance + this.visada2.distance).toFixed(2);
    },
  },
  data: () => ({
    map: null,
    showModal: false,
    antenna: {},
    antennas: [],
    markers: [],
    visada1: null,
    visada2: null,
    options: [
      {
        label: "Adicionar",
        action: "popupAdd",
        selected: true,
      },
      {
        label: "Calcular Linha de Visada",
        action: "selectVisada",
      },
      {
        label: "Limpar",
        action: "eraseAll",
      },
    ],
  }),
  mounted() {
    this.initMap();
    this.icon = L.icon({
      iconUrl:
        "https://www.seekpng.com/png/full/45-455259_png-file-antenna-icon-free.png",
      iconSize: [20, 20],
    });
  },
  methods: {
    async created() {
      this.$modal.hide("antennaModal");
      this.initAntennas();
    },
    eraseAll() {
      eraseAll().then(this.initAntennas).catch(console.error);
    },
    initMap() {
      this.map = L.map("map").setView(
        [-2.913467987104525, -41.762552261352546],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      this.map.on("click", this.onMapClick);
      this.initAntennas();
    },
    async initAntennas() {
      this.antennas = await getAntennas();
      for (const marker of this.markers) {
        this.map.removeLayer(marker);
      }
      this.markers = [];
      this.antennas.forEach((antenna) => {
        const marker = new L.marker([antenna.latlng.lat, antenna.latlng.lng], {
          icon: this.icon,
        });
        marker.on("click", (event) => this.selectVisada(event, antenna));
        this.markers.push(marker);
        this.map.addLayer(marker);
      });
    },
    selectVisada(event, antenna) {
      if (this.selectedOption.action != "selectVisada") return;
      if (this.visada1 && this.visada2) {
        this.visada1 = antenna;
        this.visada2 = null;
        return;
      }
      if (this.visada1) return (this.visada2 = antenna);
      return (this.visada1 = antenna);
    },
    onMapClick(event) {
      if (this.selectedOption?.action == "selectVisada") return;
      if (this.selectedOption?.action) this[this.selectedOption?.action](event);
    },
    popupAdd(event) {
      this.antenna = { latlng: event.latlng };
      this.showModal = true;
      this.$nextTick(() => {
        this.$modal.show("antennaModal");
      });
    },
    selectOption(option) {
      this.options = this.options.map((opt) => {
        if (option.label == opt.label) return { ...opt, selected: true };
        return { ...opt, selected: false };
      });
    },
  },
};
</script>

<style scoped>
.home,
#map {
  width: 100%;
  height: 100%;
}
.menu,
.visada-menu {
  position: fixed;
  z-index: 99999;
  right: 15px;

  background-color: white;
  box-shadow: 0px 0px 5px 0px #000;
}
.menu {
  top: 15px;
}
.visada-menu {
  bottom: 25px;
  max-width: 300px;
  padding: 16px;
}
.menu-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-list-item a {
  padding: 8px;
  display: block;
  text-align: start;
  color: #000;
  text-decoration: none;
}
.menu-list-item a:hover,
.menu-list-item a[selected="selected"] {
  background-color: lightgray;
}
</style>
