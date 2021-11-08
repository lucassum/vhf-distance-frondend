<template>
  <modal
    @closed="$emit('closed')"
    :width="'300px'"
    :height="'auto'"
    :adaptive="true"
    name="antennaModal"
  >
    <div style="padding: 24px; text-align: start">
      <h3 style="margin: 0 0 8px; text-align: center">Antena</h3>
      <div style="margin-bottom: 16px">
        <label>Nome:</label> <br />
        <input
          style="width: 100%; box-sizing: border-box"
          type="text"
          v-model="antennaData.label"
        />
      </div>
      <div style="margin-bottom: 16px">
        <label>Altura em metros:</label> <br />
        <input
          style="width: 100%; box-sizing: border-box"
          type="number"
          v-model="antennaData.height"
        />
      </div>
      <div class="actions">
        <input
          class="btn"
          type="button"
          value="Cancelar"
          @click.prevent="$modal.hide('antennaModal')"
        />
        <input
          class="btn"
          type="button"
          value="Concluir"
          @click.prevent="submit"
        />
      </div>
    </div>
  </modal>
</template>

<script>
import { createAntenna } from "../services/Antenna";
export default {
  props: ["antenna"],
  data: () => ({
    antennaData: {},
  }),
  mounted() {
    this.antennaData = this.antenna
      ? { ...this.antenna }
      : { label: "", height: 0, uuid: "", latlng: {} };
  },
  methods: {
    submit() {
      createAntenna({
        ...this.antennaData,
      })
        .then(() => {
          this.$emit("created");
        })
        .catch(console.error);
    },
  },
};
</script>
<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
}
.btn {
  width: 45%;
  padding: 8px;
}
</style>
