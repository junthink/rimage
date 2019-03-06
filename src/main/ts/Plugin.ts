declare const tinymce: any;

const setup = (editor, url) => {
  editor.addButton('rmedia', {
    text: 'rmedia button',
    icon: false,
    onclick: () => {
      // tslint:disable-next-line:no-console
      editor.setContent('<p>content added from rmedia</p>');
    }
  });
};

tinymce.PluginManager.add('rmedia', setup);

// tslint:disable-next-line:no-empty
export default () => {};
