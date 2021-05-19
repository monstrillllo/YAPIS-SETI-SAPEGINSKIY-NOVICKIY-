<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Films</h1>
        <hr><br><br>
        <alert :message=message v-if="showMessage"></alert>
        <button type="button" class="btn btn-success btn-sm" v-b-modal.film-modal>Add Film</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Genre</th>
              <th scope="col">Short review</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(film, index) in films" :key="index">
              <td>{{ film.title }}</td>
              <td>{{ film.genre }}</td>
              <td>{{ film.short_review }}</td>
              <td>
                <button
                type="button"
                class="btn btn-warning btn-sm"
                v-b-modal.film-update-modal
                @click="editFilm(film)">Update</button>
                <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="onDeleteFilm(film)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal ref="addFilmModal"
             id="film-modal"
             title="Add a new film"
             hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
      <b-form-group id="form-title-group"
                    label="Title:"
                    label-for="form-title-input">
          <b-form-input id="form-title-input"
                        type="text"
                        v-model="addFilmForm.title"
                        required
                        placeholder="Enter title">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-genre-group"
                      label="Genre:"
                      label-for="form-genre-input">
            <b-form-input id="form-genre-input"
                          type="text"
                          v-model="addFilmForm.genre"
                          required
                          placeholder="Enter genre">
            </b-form-input>
          </b-form-group>
        <b-form-group id="form-short_review-group"
                      label="Short review:"
                      label-for="form-short_review-input">
            <b-form-input id="form-short_review-input"
                          type="text"
                          v-model="addFilmForm.short_review"
                          required
                          placeholder="Enter short review">
            </b-form-input>
          </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
    <b-modal ref="editFilmModal"
         id="film-update-modal"
         title="Update"
         hide-footer>
  <b-form @submit="onSubmitUpdate" @reset="onResetUpdate" class="w-100">
  <b-form-group id="form-title-edit-group"
                label="Title:"
                label-for="form-title-edit-input">
      <b-form-input id="form-title-edit-input"
                    type="text"
                    v-model="editForm.title"
                    required
                    placeholder="Enter title">
      </b-form-input>
    </b-form-group>
    <b-form-group id="form-genre-edit-group"
                  label="Genre:"
                  label-for="form-genre-edit-input">
        <b-form-input id="form-genre-edit-input"
                      type="text"
                      v-model="editForm.genre"
                      required
                      placeholder="Enter genre">
        </b-form-input>
      </b-form-group>
     <b-form-group id="form-short_review-edit-group"
                  label="Short review:"
                  label-for="form-short_review-edit-input">
        <b-form-input id="form-short_review-edit-input"
                      type="text"
                      v-model="editForm.short_review"
                      required
                      placeholder="Enter short review">
        </b-form-input>
      </b-form-group>
    <b-button type="submit" variant="primary">Update</b-button>
    <b-button type="reset" variant="danger">Cancel</b-button>
  </b-form>
</b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert';

export default {
  data() {
    return {
      films: [],
      addFilmForm: {
        title: '',
        genre: '',
        short_review: '',
      },
      message: [],
      showMessage: false,
      editForm: {
        id: '',
        title: '',
        genre: '',
        short_review: '',
      },
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
    getFilms() {
      const path = 'http://localhost:5000/api/v1.0/films';
      axios.get(path)
        .then((res) => {
          this.films = res.data.films;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addFilm(payload) {
      const path = 'http://localhost:5000/api/v1.0/films';
      axios.post(path, payload)
        .then(() => {
          this.getFilms();
          this.message = 'Films added!';
          this.showMessage = true;
        })
        .catch((error) => {
          console.log(error);
          this.getFilms();
        });
    },
    UpdateFilm(payload, filmID) {
      const path = `http://localhost:5000/api/v1.0/films/${filmID}`;
      axios.put(path, payload)
        .then(() => {
          this.getFilms();
          this.message = 'Film updated!';
          this.showMessage = true;
        })
        .catch((error) => {
          console.error(error);
          this.getFilms();
        });
    },
    onResetUpdate(evt) {
      evt.preventDefault();
      this.$refs.editFilmModal.hide();
      this.initForm();
      this.getFilms();
    },
    editFilm(film) {
      this.editForm = film;
    },
    onSubmitUpdate(evt) {
      evt.preventDefault();
      this.$refs.editFilmModal.hide();
      const payload = {
        title: this.editForm.title,
        genre: this.editForm.genre,
        short_review: this.editForm.short_review,
      };
      this.UpdateFilm(payload, this.editForm.id);
    },
    initForm() {
      this.addFilmForm.title = '';
      this.addFilmForm.genre = '';
      this.addFilmForm.short_review = '';
      this.editForm.id = '';
      this.editForm.title = '';
      this.editForm.genre = '';
      this.editForm.short_review = '';
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addFilmModal.hide();
      const payload = {
        title: this.addFilmForm.title,
        genre: this.addFilmForm.genre,
        short_review: this.addFilmForm.short_review,
      };
      this.addFilm(payload);
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addFilmModal.hide();
      this.initForm();
    },
    removeFilm(filmID) {
      const path = `http://localhost:5000/films/${filmID}`;
      axios.delete(path)
        .then(() => {
          this.getFilms();
          this.message = 'Film removed!';
          this.showMessage = true;
        })
        .catch((error) => {
          console.error(error);
          this.getFilms();
        });
    },
    onDeleteFilm(film) {
      this.removeFilm(film.id);
    },
  },
  created() {
    this.getFilms();
  },
};
</script>
