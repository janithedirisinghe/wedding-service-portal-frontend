import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OrganizationChartModule } from 'primeng/organizationchart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'wedding-service-portal-frontend';

  data: TreeNode[] = [
        {
            label: 'Argentina',
            expanded: true,
            data: 'ar',
            children: [
                {
                    label: 'Argentina',
                    expanded: true,
                    data: 'ar',
                    children: [
                        {
                            label: 'Argentina',
                            data: 'ar'
                        },
                        {
                            label: 'Croatia',
                            data: 'hr'
                        }
                    ]
                },
                {
                    label: 'France',
                    expanded: true,
                    data: 'fr',
                    children: [
                        {
                            label: 'France',
                            data: 'fr'
                        },
                        {
                            label: 'Morocco',
                            data: 'ma'
                        }
                    ]
                }
            ]
        }
    ];
}
