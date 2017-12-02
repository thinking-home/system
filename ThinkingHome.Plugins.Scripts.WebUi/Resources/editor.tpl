<h1>{{name}}</h1>
<div class="row">
    <div class="col-md-8">
        <p>
            <a href="#" class="btn btn-primary js-script-save">{{lang 'Save'}}</a>
            <a href="#" class="btn btn-secondary js-script-cancel">{{lang 'Cancel'}}</a>
            <a href="#" class="btn btn-danger float-right d-none js-script-delete">{{lang 'Delete'}}</a>
        </p>
        <div class="js-script-body"></div>
        <div class="cm-s-bootstrap CodeMirror-panel js-editor-panel">
            <a href="#" class="btn btn-secondary btn-sm js-enter-fullscreen">{{lang 'Fullscreen editing'}}</a>
            <a href="#" class="btn btn-secondary btn-sm js-exit-fullscreen d-none">{{lang 'Exit fullscreen'}}</a>
        </div>
    </div>
</div>
