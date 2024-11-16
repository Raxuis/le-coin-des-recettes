interface ShareProps {
    slug: string;
    title?: string;
    action: 'shareToSocial' | 'copyToClipboard';
}

export const shareRecipe = async ({ slug, title, action }: ShareProps) => {
    const toast = useToast();
    const url = window.location.origin;
    const shareUrl = `${url}/recipe/${slug}`;

    try {
        if (action === 'shareToSocial' && navigator.share) {
            await navigator.share({
                title: 'Le coin des recettes.',
                text: `${'Recette de ' + title + '.' || 'Recette partagée avec vous.'}`,
                url: shareUrl,
            });
        } else {
            await navigator.clipboard.writeText(`${'Recette de ' + title + ' : ' + shareUrl || 'Recette partagée avec vous.'}`);
        }
        toast.add({
            title: 'Copié avec succès !',
            description: 'Pourquoi pas partager cette recette maintenant. 🌮',
            icon: 'material-symbols:content-copy',
            color: 'green',
        });
    } catch {
        toast.add({
            title: 'Une erreur est survenue ! 😕',
            description: 'Veuillez réessayer...',
            icon: 'tdesign:error-triangle',
            actions: [
                {
                    label: 'Réessayer',
                    color: 'white',
                    click: () => {
                        shareRecipe({ slug, title, action });
                    },
                },
            ],
            color: 'red',
        });
    }
};
