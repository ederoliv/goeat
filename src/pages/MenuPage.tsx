import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MenuPage() {
  return (
    <div className="p-6 bg-background text-foreground">
      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary">Goeat Green Burguer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Delicioso hambúrguer com selo de qualidade.</p>
          <Button className="bg-primary text-secondary hover:bg-primary/90 mt-4">
            Adicionar ao Carrinho
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}