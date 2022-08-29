from django import forms

class add_note_form(forms.Form):
    title = forms.CharField(max_length = 100, required = False)
    note = forms.CharField(widget=forms.Textarea, required = False)